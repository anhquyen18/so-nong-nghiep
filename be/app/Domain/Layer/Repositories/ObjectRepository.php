<?php

namespace Domain\Layer\Repositories;

use App\Models\Layer;
use Domain\Layer\Repositories\ObjectRepositoryInterface;
use Illuminate\Support\Facades\DB;

class ObjectRepository implements ObjectRepositoryInterface
{

    /**
     * Lấy ra những object thuộc một layer
     *
     * @param $layerId tên của table trong db của cần lấy object
     * WKT: Well-Known Text (geom) sẽ được biên dịch thành x, y trước khi trả về client
     */
    public function getObjects($layerId)
    {
        $query = DB::table($layerId)
            ->selectRaw("
        {$layerId}.id,
        {$layerId}.name,
        {$layerId}.datafields,
        jsonb_agg(
            jsonb_build_object('x', ST_X(point.geom), 'y', ST_Y(point.geom))
        ) AS coordinates
    ")
            ->crossJoin(DB::raw("LATERAL ST_DumpPoints({$layerId}.geom) AS point"))
            ->groupBy("{$layerId}.id", "{$layerId}.name")
            ->orderBy("{$layerId}.id")
            ->get();

        return $query;
    }
}
