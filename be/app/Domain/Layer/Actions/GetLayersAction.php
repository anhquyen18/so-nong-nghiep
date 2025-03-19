<?php

namespace Domain\Layer\Actions;

use Domain\Layer\Repositories\LayerRepositoryInterface;

class GetLayersAction
{
    public $layerRepository;
    public function __construct(LayerRepositoryInterface $layerRepository)
    {
        $this->layerRepository = $layerRepository;
    }

    public function handle($departmentId)
    {
        $layers = $this->layerRepository->getLayers($departmentId);
        return $layers;
    }
}
