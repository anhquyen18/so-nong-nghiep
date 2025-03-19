<?php

namespace App\Providers;

use Domain\Department\Repositories\DepartmentRepository;
use Domain\Department\Repositories\DepartmentRepositoryInterface;
use Domain\Layer\Repositories\LayerRepository;
use Domain\Layer\Repositories\LayerRepositoryInterface;
use Domain\Layer\Repositories\ObjectRepository;
use Domain\Layer\Repositories\ObjectRepositoryInterface;
use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(LayerRepositoryInterface::class, LayerRepository::class);
        $this->app->bind(DepartmentRepositoryInterface::class, DepartmentRepository::class);
        $this->app->bind(ObjectRepositoryInterface::class, ObjectRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
