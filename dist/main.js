"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path_1 = require("path");
const express_handlebars_1 = require("express-handlebars");
const swagger_1 = require("@nestjs/swagger");
const nestjs_i18n_1 = require("nestjs-i18n");
const class_validator_1 = require("class-validator");
const helpers = require("./shared/helpers");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {});
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'));
    app.setBaseViewsDir((0, path_1.join)(__dirname, '..', 'views'));
    app.engine('hbs', (0, express_handlebars_1.engine)({
        extname: '.hbs',
        helpers,
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true,
        },
    }));
    app.set('view engine', 'hbs');
    app.use(cookieParser());
    app.use(session({
        secret: 'secret-key',
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
    }));
    app.useGlobalPipes(new nestjs_i18n_1.I18nValidationPipe({ transform: true }));
    app.useGlobalFilters(new nestjs_i18n_1.I18nValidationExceptionFilter({ detailedErrors: true }));
    const cofig = new swagger_1.DocumentBuilder()
        .setTitle('CMS API')
        .setDescription('CMS API Description')
        .setVersion('1.0')
        .addTag('CMS')
        .addCookieAuth('connect.sid')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, cofig);
    swagger_1.SwaggerModule.setup('api-doc', app, document);
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map