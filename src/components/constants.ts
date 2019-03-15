// this is a stupid hack to prevent random crawling bots from DDOSing me
// obviously completely ineffective against someone who can open up this source code and read this comment
export const API_TOKEN = "203c2595ad105722dbcbb41c4c380dfcec59cb98aaee41ad2d84c9cbfaa68feb";

const remoteApiServer =  "https://boompig.herokuapp.com";
const localApiServer = "http://localhost:9897";
const isLocalServer = (): boolean => {
	const ipOrHostname = window.location.hostname;
	return (ipOrHostname === "localhost" || ipOrHostname === "127.0.0.1");
};
export const API_SERVER = isLocalServer() ? localApiServer : remoteApiServer;
