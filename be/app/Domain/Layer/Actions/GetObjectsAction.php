<?php

namespace Domain\Layer\Actions;

use Domain\Layer\Repositories\ObjectRepositoryInterface;

class GetObjectsAction
{
    public $objectRepository;
    public function __construct(ObjectRepositoryInterface $objectRepository)
    {
        $this->objectRepository = $objectRepository;
    }

    public function handle($layerId)
    {
        $layers = $this->objectRepository->getObjects($layerId);
        return $layers;
    }
}
