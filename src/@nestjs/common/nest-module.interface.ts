import { MiddlewareConsumer } from "@nestjs/common";

export interface NestModule {
    configure(consumer:MiddlewareConsumer):void
}