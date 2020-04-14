import { RawSource } from "webpack-sources";
import MarkdownHandler from 'markdown-handler';


export default class MarkdownSiteMapGeneratorPlugin {
    constructor(options = {}) {
        this.options = Object.assign(
            {
                host: "https://www.sporule.com",
                links: [],
                route: "/items",
                outputPath:"sitemap.txt"
            },
            options
        );
    }

    sortPost = (mds, isDesc = true) => {
        mds = mds.sort((a, b) => {
            let dateA = new Date(a.metas.date);
            let dateB = new Date(b.metas.date);
            return isDesc ? dateB - dateA : dateA - dateB;
        })
        return mds;
    }

    removeFuturePosts = (mds) => {
        //remove future and posts with no date
        mds = mds.filter(post => {
            if (post.metas.date && post.metas.date != "null") {
                return new Date(post.metas.date) <= new Date();
            }
            return false;
        })
        return mds;
    }

    getCategories = (posts) => {
        let categories = [];
        posts.forEach(item => {
            item.metas.categories.forEach(o => {
                if (!categories.includes(o)) {
                    categories.push(o);
                }
            })
        });
        return categories;
    }

    apply(compiler) {
        // Specify the event hook to attach to
        compiler.hooks.emit.tapAsync(
            'RSSGeneratorPlugin',
            (compilation, callback) => {
                let mds = [];
                let mdHandler = new MarkdownHandler();
                let regex = /.*\.md$/gm;
                for (let path in compilation.assets) {
                    if (path.search(regex) >= 0) {
                        let md = compilation.assets[path].source().toString();
                        mds.push(mdHandler.parseContent(path, md));
                    }
                }
                mds = this.removeFuturePosts(mds);
                mds = this.sortPost(mds, true);
                let all_links = [];
                let categories = this.getCategories(mds);
                categories.forEach(cat => {
                    all_links.push(this.options.host + "/categories/" + cat.split(" ").join("%20"));
                })
                mds.forEach(md => {
                    let path = md.path.split(".")[0].replace("posts", this.options.route);
                    all_links.push(this.options.host + path);
                })
                all_links = [this.options.host, ...this.options.links, ...all_links]
                compilation.assets[this.options.outputPath] = new RawSource(all_links.join("\n"));
                callback();
            }
        );


    }
}