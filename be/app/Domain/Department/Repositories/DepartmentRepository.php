<?php

namespace Domain\Department\Repositories;

use App\Models\Department;
use Domain\Department\Repositories\DepartmentRepositoryInterface;

class DepartmentRepository implements DepartmentRepositoryInterface
{
    protected $department;

    public function __construct(Department $department)
    {
        $this->department = $department;
    }

    public function model()
    {
        return $this->department;
    }

    public function all()
    {
        return $this->department->all();
    }
}
