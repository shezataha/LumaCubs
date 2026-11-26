<?php
declare(strict_types=1);

use LumaCubs\Controllers\AuthController;
use LumaCubs\Controllers\CatalogController;
use LumaCubs\Controllers\ChildrenController;
use LumaCubs\Controllers\DashboardController;
use LumaCubs\Controllers\HealthController;
use LumaCubs\Controllers\ProgressController;
use LumaCubs\Controllers\SettingsController;
use LumaCubs\Router;

/** @var Router $router */
$router->get('/health', [HealthController::class, 'ping']);
$router->get('/ping', [HealthController::class, 'ping']);

$router->post('/auth/register', [AuthController::class, 'register']);
$router->post('/auth/login', [AuthController::class, 'login']);
$router->post('/auth/logout', [AuthController::class, 'logout']);
$router->get('/auth/me', [AuthController::class, 'me']);
$router->post('/auth/forgot', [AuthController::class, 'forgot']);
$router->post('/auth/reset', [AuthController::class, 'reset']);

$router->get('/children', [ChildrenController::class, 'list']);
$router->post('/children', [ChildrenController::class, 'create']);
$router->patch('/children/{id}', [ChildrenController::class, 'update']);
$router->delete('/children/{id}', [ChildrenController::class, 'deactivate']);
$router->post('/children/{id}/select', [ChildrenController::class, 'select']);
$router->post('/children/select', [ChildrenController::class, 'select']);

$router->get('/dashboard/child', [DashboardController::class, 'childDashboard']);
$router->get('/dashboard/parent', [DashboardController::class, 'parentOverview']);

$router->get('/age-groups', [CatalogController::class, 'ageGroups']);
$router->get('/languages', [CatalogController::class, 'languages']);
$router->get('/segments', [CatalogController::class, 'segments']);
$router->get('/segments/{id}/subcategories', [CatalogController::class, 'subcategories']);
$router->get('/segments/{id}/categories', [CatalogController::class, 'categories']);
$router->get('/categories/{id}/topics', [CatalogController::class, 'categoryTopics']);
$router->get('/content', [CatalogController::class, 'content']);

$router->get('/progress', [ProgressController::class, 'list']);
$router->post('/progress', [ProgressController::class, 'upsert']);
$router->get('/achievements', [ProgressController::class, 'achievements']);

$router->get('/settings/parent', [SettingsController::class, 'getParent']);
$router->put('/settings/parent', [SettingsController::class, 'putParent']);
$router->post('/settings/parent', [SettingsController::class, 'putParent']);
$router->get('/settings/children/{id}', [SettingsController::class, 'getChild']);
$router->put('/settings/children/{id}', [SettingsController::class, 'putChild']);
$router->post('/settings/children/{id}', [SettingsController::class, 'putChild']);
