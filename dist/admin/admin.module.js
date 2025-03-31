"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const dashboard_controller_1 = require("./controllers/dashboard.controller");
const user_controller_1 = require("./controllers/user.controller");
const role_controller_1 = require("./controllers/role.controller");
const access_controller_1 = require("./controllers/access.controller");
const tag_controller_1 = require("./controllers/tag.controller");
const article_controller_1 = require("./controllers/article.controller");
const category_controller_1 = require("./controllers/category.controller");
const upload_controller_1 = require("./controllers/upload.controller");
const setting_controller_1 = require("./controllers/setting.controller");
const auth_controller_1 = require("./controllers/auth.controller");
const auth_middleware_1 = require("./middlewares/auth.middleware");
let AdminModule = class AdminModule {
    configure(consumer) {
        consumer
            .apply(auth_middleware_1.AuthMiddleware)
            .exclude('/admin/login', '/admin/captcha', '/admin/logout')
            .forRoutes('/admin/*');
    }
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            dashboard_controller_1.DashboardController,
            user_controller_1.UserController,
            role_controller_1.RoleController,
            access_controller_1.AccessController,
            tag_controller_1.TagController,
            article_controller_1.ArticleController,
            category_controller_1.CategoryController,
            upload_controller_1.UploadController,
            setting_controller_1.SettingController,
            auth_controller_1.AuthController,
        ],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map