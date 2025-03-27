"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const configuration_service_1 = require("./services/configuration.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const user_service_1 = require("./services/user.service");
const user_validator_1 = require("./validators/user-validator");
const utility_service_1 = require("./services/utility.service");
const role_entity_1 = require("./entities/role.entity");
const role_service_1 = require("./services/role.service");
const access_entity_1 = require("./entities/access.entity");
const access_service_1 = require("./services/access.service");
const tag_entity_1 = require("./entities/tag.entity");
const tag_service_1 = require("./services/tag.service");
const article_entity_1 = require("./entities/article.entity");
const article_service_1 = require("./services/article.service");
const category_entity_1 = require("./entities/category.entity");
const category_service_1 = require("./services/category.service");
const cos_service_1 = require("./services/cos.service");
const notification_service_1 = require("./services/notification.service");
const mail_service_1 = require("./services/mail.service");
const word_export_service_1 = require("./services/word-export.service");
const ppt_export_ervice_1 = require("./services/ppt-export.ervice");
const excel_export_service_1 = require("./services/excel-export.service");
const setting_service_1 = require("./services/setting.service");
const mongoose_1 = require("@nestjs/mongoose");
const setting_schema_1 = require("./schemas/setting.schema");
const dashboard_service_1 = require("./services/dashboard.service");
const weather_service_1 = require("./services/weather.service");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            user_validator_1.IsUserNameUniqueConstraint,
            configuration_service_1.ConfigurationService,
            user_service_1.UserService,
            utility_service_1.UtilityService,
            role_service_1.RoleService,
            access_service_1.AccessService,
            tag_service_1.TagService,
            article_service_1.ArticleService,
            category_service_1.CategoryService,
            cos_service_1.CosService,
            notification_service_1.NotificationService,
            mail_service_1.MailService,
            word_export_service_1.WordExportService,
            ppt_export_ervice_1.PptExportService,
            excel_export_service_1.ExcelExportService,
            setting_service_1.SettingService,
            dashboard_service_1.DashboardService,
            weather_service_1.WeatherService,
        ],
        exports: [
            user_validator_1.IsUserNameUniqueConstraint,
            configuration_service_1.ConfigurationService,
            user_service_1.UserService,
            utility_service_1.UtilityService,
            role_service_1.RoleService,
            access_service_1.AccessService,
            tag_service_1.TagService,
            article_service_1.ArticleService,
            category_service_1.CategoryService,
            cos_service_1.CosService,
            notification_service_1.NotificationService,
            mail_service_1.MailService,
            word_export_service_1.WordExportService,
            ppt_export_ervice_1.PptExportService,
            excel_export_service_1.ExcelExportService,
            setting_service_1.SettingService,
            dashboard_service_1.DashboardService,
            weather_service_1.WeatherService,
        ],
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            mongoose_1.MongooseModule.forRootAsync({
                inject: [configuration_service_1.ConfigurationService],
                useFactory: (configurationService) => {
                    return {
                        uri: configurationService.mongodbConfig.uri,
                    };
                },
            }),
            mongoose_1.MongooseModule.forFeature([{ name: setting_schema_1.Setting.name, schema: setting_schema_1.SettingSchema }]),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [configuration_service_1.ConfigurationService],
                useFactory: (configurationService) => {
                    return {
                        type: 'mysql',
                        ...configurationService.mysqlConfig,
                        autoLoadEntities: true,
                        synchronize: true,
                        logging: false,
                    };
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, role_entity_1.Role, access_entity_1.Access, tag_entity_1.Tag, article_entity_1.Article, category_entity_1.Category]),
        ],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map