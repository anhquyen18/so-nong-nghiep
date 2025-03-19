<?php

namespace Domain\Department\Actions;

use Domain\Department\Repositories\DepartmentRepositoryInterface;

class GetDepartmentsAction
{
    public $departmentRepository;
    public function __construct(DepartmentRepositoryInterface $departmentRepository)
    {
        $this->departmentRepository = $departmentRepository;
    }

    public function handle()
    {
        $departments = $this->departmentRepository->all();
        return $departments;
    }
}
