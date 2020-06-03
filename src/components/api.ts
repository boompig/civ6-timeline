import {API_SERVER, API_TOKEN} from "./constants";

export async function getRecentUploads(): Promise<Response> {
	const url = new URL(API_SERVER);
	url.pathname = "/civ6-timeline/games/recent";
	url.searchParams.append("token", API_TOKEN);
	return window.fetch(url.toString(), {
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
		method: "GET",
		mode: "cors",
	});
}

export async function getGame(hash: string): Promise<Response> {
	const url = new URL(API_SERVER);
	url.pathname = `/civ6-timeline/game/${hash}`;
	url.searchParams.append("token", API_TOKEN);
	return window.fetch(url.toString(), {
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
		method: "GET",
		mode: "cors",
	});
}

export async function uploadFile(file: File): Promise<Response> {
	const formData = new FormData();
	formData.append("token", API_TOKEN);
	formData.append("timeline", file);
	const url = new URL(API_SERVER);
	url.pathname = "/civ6-timeline/upload";
	return window.fetch(url.toString(), {
		body: formData,
		cache: "no-cache",
		method: "POST",
		mode: "cors",
	});
}
