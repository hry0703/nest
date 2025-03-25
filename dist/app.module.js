"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const admin_module_1 = require("./admin/admin.module");
const api_module_1 = require("./api/api.module");
const shared_module_1 = require("./shared/shared.module");
const logger_module_1 = require("./logger/logger.module");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const path = require("path");
const serve_static_1 = require("@nestjs/serve-static");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_i18n_1 = require("nestjs-i18n");
const methodOverride_1 = require("./shared/middleware/methodOverride");
const { combine, timestamp, printf } = winston.format;
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(methodOverride_1.default).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_emitter_1.EventEmitterModule.forRoot({
                wildcard: true,
                delimiter: '.',
                global: true
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: path.join(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            nestjs_i18n_1.I18nModule.forRoot({
                fallbackLanguage: 'en',
                loaderOptions: {
                    path: path.join(__dirname, '/i18n/'),
                    watch: true,
                },
                resolvers: [
                    new nestjs_i18n_1.QueryResolver(['lang', 'l']),
                    nestjs_i18n_1.AcceptLanguageResolver,
                ],
            }),
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        format: combine(timestamp({ format: 'YYYY-MM-DD hh:mm:ss' }), printf(({ level, message, timestamp, context }) => {
                            return ` [Nest] ${process.pid}  - ${timestamp} ${level}  [${context}]  ${message}`;
                        })),
                    }),
                    new winston.transports.File({
                        filename: 'error.log',
                        level: 'error',
                    }),
                ],
            }),
            logger_module_1.LoggerModule,
            shared_module_1.SharedModule,
            admin_module_1.AdminModule,
            api_module_1.ApiModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map