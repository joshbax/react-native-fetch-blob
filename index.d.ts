
declare module "react-native-fetch-blob" {

    interface FetchPromiseOptions {
        interval?: number;
        count?: number;
    }

    class FetchPromise<T> extends Promise<T> {
        public progress(callback: (received: number, total: number) => void): Promise<T>;
        public progress(options: FetchPromiseOptions, callback?: (received: number, total: number) => void): Promise<T>;

        public uploadProgress(callback: (received: number, total: number) => void): Promise<T>;
        public uploadProgress(options: FetchPromiseOptions, callback?: (written: number, total: number) => void): Promise<T>;
    }

    interface RNFetchBlobStream {
        onData(fn: (chunk: string | number[]) => void): void;
        onError(fn: (err: Error) => void): void;
        onEnd(fn: () => void): void;
    }
    interface RNFetchBlobReadStream extends RNFetchBlobStream {
        open: () => void;
    }

    interface RNFetchBlobWriteStream extends RNFetchBlobStream {
        write: (data: string) => Promise<void>;
        close: () => Promise<void>;
    }

    interface RNFetchBlobFile {
        size: number;
        filename: string;
        path: string;
        lastModified: number;
        type: "directory" | "file";
    }

    interface FS {
        dirs: {
            DocumentDir: string;
            CacheDir: string;
            PictureDir: string;
            MusicDir: string;
            MovieDir: string;
            DownloadDir: string;
            DCIMDir: string;
            SDCardDir: string;
            SDCardApplicationDir: string;
            MainBundleDir: string;
            LibraryDir: string;
        }

        createFile: (path: string, data: string, encoding: 'base64' | 'ascii' | 'utf8') => Promise<void>;

        readStream: (path: string, encoding: 'utf8' | 'ascii' | 'base64', bufferSize?: number, tick?: number) => Promise<RNFetchBlobReadStream>;
        readFile: (path: string, encoding: string, bufferSize?: number) => Promise<string | number[]>;

        writeStream: (path: string, encoding: 'utf8' | 'ascii' | 'base64', append?: boolean) => Promise<RNFetchBlobWriteStream>;
        writeFile: (path: string, data: string | Array<number>, encoding: 'utf8' | 'ascii' | 'base64') => Promise<number>;

        /**
         * Create a directory.
         * @param  {string} path Path of directory to be created
         * @return {Promise}
         */
        mkdir(path: string): Promise<void>;

        stat(path: string): Promise<RNFetchBlobFile>;
        cp(path: string, dest: string): Promise<boolean>;
        mv(path: string, dest: string): Promise<boolean>;
        lstat(path: string): Promise<Array<RNFetchBlobFile>>;
        ls(path: string): Promise<Array<string>>;
        unlink(path: string): Promise<void>;
        exists(path: string): Promise<boolean[]>;
        isDir(path: string): Promise<boolean>;
        df(): Promise<{ free: number, total: number }>;
    }

    interface RNFetchBlobConfig {
        fileCache?: boolean;
        path?: string,
        appendExt?: string;
        session: string;
        addAndroidDownloads?: any;
        indicator?: boolean;
    }

    interface RNFetchBlobResponseInfo {
        taskId: string;
        state: number,
        headers: any;
        status: number;
        respType: 'text' | 'blob' | '' | 'json';
        rnfbEncode: 'path' | 'base64' | 'ascii' | 'utf8';
    }

    class FetchBlob {

        public fs: FS;

        /**
         * Calling this method will inject configurations into followed `fetch` method.
         * @param  {RNFetchBlobConfig} options
         * Fetch API configurations, contains the following options :
         * @property {boolean} fileCache
         *           When fileCache is `true`, response data will be saved in
         *           storage with a random generated file name, rather than
         *           a BASE64 encoded string.
         * @property {string} appendExt
         *           Set this property to change file extension of random-
         *           generated file name.
         * @property {string} path
         *           If this property has a valid string format, resonse data
         *           will be saved to specific file path. Default string format
         *           is : `RNFetchBlob-file://path-to-file`
         * @property {string} key
         *           If this property is set, it will be converted to md5, to
         *           check if a file with this name exists.
         *           If it exists, the absolute path is returned (no network
         *           activity takes place )
         *           If it doesn't exist, the file is downloaded as usual
         * @property {number} timeout
         *           Request timeout in millionseconds, by default it's 30000ms.
         *
         * @return {function} This method returns a `fetch` method instance.
         */
        config(options: RNFetchBlobConfig): void;


        /**
         * Fetch from file system, use the same interface as RNFB.fetch
         * @param  {RNFetchBlobConfig} [options={}] Fetch configurations
         * @param  {string} method     Should be one of `get`, `post`, `put`
         * @param  {string} url        A file URI string
         * @param  {string} headers    Arguments of file system API
         * @param  {any} body       Data to put or post to file systen.
         * @return {Promise}
         */
        fetchFile(options: RNFetchBlobConfig, method: string, url: string, headers?: any, body?: any): FetchPromise<any>;
        fetchFile(method: string, url: string, headers?: any, body?: any): FetchPromise<any>;
        fetchFile(method: string, url: string, body?: any): FetchPromise<any>;

        /**
        * Create a HTTP request by settings, the `this` context is a `RNFetchBlobConfig` object.
        * @param  {string} method HTTP method, should be `GET`, `POST`, `PUT`, `DELETE`
        * @param  {string} url Request target url string.
        * @param  {object} headers HTTP request headers.
        * @param  {string} body
        *         Request body, can be either a BASE64 encoded data string,
        *         or a file path with prefix `RNFetchBlob-file://` (can be changed)
        * @return {Promise}
        *         This promise instance also contains a Customized method `progress`for
        *         register progress event handler.
        */
        fetch(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, headers: any, body?: any): FetchPromise<any>;

        wrap(path: string): string;
    }

    const RNFetchBlob: FetchBlob;
    export = RNFetchBlob;
}
