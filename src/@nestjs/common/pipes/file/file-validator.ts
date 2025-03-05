export abstract class FileValidator{
    constructor(protected readonly validationOptions) {}
    abstract isValid(file?:Express.Multer.File):boolean | Promise<boolean>;
}

