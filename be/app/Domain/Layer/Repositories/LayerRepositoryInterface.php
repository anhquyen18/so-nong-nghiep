<?php

namespace Domain\Layer\Repositories;

interface LayerRepositoryInterface
{
    public function model();
    public function all();
    public function getLayers($departmentId);
    // public function create(array $data);
    // public function update($instance, array $data);
    // public function delete($instance);
    // public function findByField(array $selectedFields, $field, $value, $operator = '=', $paginate = null);
}
