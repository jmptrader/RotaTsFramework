import { IBaseService} from "./service.interface";

interface ICacheable {

}

interface ICaching extends IBaseService {
    saveToCache(cacheKey: string, data: ICacheable): void;
    saveToSession(cacheKey: string, data: ICacheable): void;
    removeCache(cacheKey: string): void;
    removeSession(cacheKey: string): void;
    restoreFromCache<T extends ICacheable>(cacheKey: string): T;
    restoreFromSession<T extends ICacheable>(cacheKey: string): T;
}

export {ICacheable, ICaching}