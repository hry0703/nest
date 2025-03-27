import { DashboardService } from 'src/shared/services/dashboard.service';
import { SystemService } from 'src/shared/services/system.service';
import { WeatherService } from 'src/shared/services/weather.service';
export declare class DashboardController {
    private readonly dashboardService;
    private readonly weatherService;
    private readonly systemService;
    constructor(dashboardService: DashboardService, weatherService: WeatherService, systemService: SystemService);
    dashboard(): Promise<{
        userCount: number;
        articleCount: number;
        categoryCount: number;
        tagCount: number;
        latestUsers: import("../../shared/entities/user.entity").User[];
        latestArticles: import("../../shared/entities/article.entity").Article[];
        latestCategories: import("../../shared/entities/category.entity").Category[];
        latestTags: import("../../shared/entities/tag.entity").Tag[];
        usersTrend: {
            dates: any;
            counts: any;
        };
        articlesTrend: {
            dates: any;
            counts: any;
        };
        categoriesTrend: {
            dates: any;
            counts: any;
        };
        tagsTrend: {
            dates: any;
            counts: any;
        };
    }>;
    getWeather(): Promise<{
        weather: string;
    }>;
    getSystem(): Promise<import("rxjs").Observable<{
        data: {
            cpu: {
                cores: number;
                userLoad: string;
                systemLoad: string;
                idle: string;
            };
            memory: {
                total: string;
                used: string;
                free: string;
                usage: string;
            };
            disks: {
                mount: string;
                filesystem: string;
                type: string;
                size: string;
                used: string;
                available: string;
                usage: string;
            }[];
            server: {
                hostname: string;
                ip: any;
                os: string;
                arch: string;
            };
        };
    }>>;
}
