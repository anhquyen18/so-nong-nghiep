<?php

namespace Domain\Layer\Repositories;

use App\Models\Layer;
use Domain\Layer\Repositories\LayerRepositoryInterface;

class LayerRepository implements LayerRepositoryInterface
{
    protected $layer;

    public function __construct(Layer $layer)
    {
        $this->layer = $layer;
    }

    public function model()
    {
        return $this->layer;
    }

    public function all()
    {
        return $this->layer->all();
    }

    /**
     * Lấy ra những layer thuộc một deparment
     *
     * @param $departmentId id của department cần lấy layer
     */
    public function getLayers($departmentId)
    {
        return $this->layer->where('department_id', $departmentId)->with(['department:id,name'])->get();
    }
}
