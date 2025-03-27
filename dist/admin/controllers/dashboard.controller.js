"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("../../shared/services/dashboard.service");
const system_service_1 = require("../../shared/services/system.service");
const weather_service_1 = require("../../shared/services/weather.service");
let DashboardController = class DashboardController {
    dashboardService;
    weatherService;
    systemService;
    constructor(dashboardService, weatherService, systemService) {
        this.dashboardService = dashboardService;
        this.weatherService = weatherService;
        this.systemService = systemService;
    }
    async dashboard() {
        return await this.dashboardService.getDashboardData();
    }
    async getWeather() {
        const weather = await this.weatherService.getWeather();
        return weather;
    }
    async getSystem() {
        return (0, rxjs_1.interval)(3000).pipe((0, operators_1.mergeMap)(() => this.systemService.getSystemInfo()), (0, operators_1.map)((systemInfo) => ({ data: systemInfo })));
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "dashboard", null);
__decorate([
    (0, common_1.Get)('weather'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getWeather", null);
__decorate([
    (0, common_1.Sse)('systemInfo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getSystem", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('报表'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService,
        weather_service_1.WeatherService,
        system_service_1.SystemService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map