import type {NextConfig} from "next";
const repo=process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath=process.env.PAGES_BUILD&&repo?`/${repo}`:"";
const config:NextConfig={output:"export",basePath,assetPrefix:basePath,trailingSlash:true,images:{unoptimized:true}};
export default config;
