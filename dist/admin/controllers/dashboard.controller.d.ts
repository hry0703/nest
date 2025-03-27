import { DashboardService } from 'src/shared/services/dashboard.service';
import { WeatherService } from 'src/shared/services/weather.service';
export declare class DashboardController {
    private readonly dashboardService;
    private readonly weatherService;
    constructor(dashboardService: DashboardService, weatherService: WeatherService);
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
}
