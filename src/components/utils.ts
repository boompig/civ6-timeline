export const StringToTitleCase = (s: string) => {
	const words = s.split(/ /g);
	for (let i = 0; i < words.length; i++) {
		words[i] = words[i][0].toUpperCase() + words[i].substr(1).toLowerCase();
	}
	return words.join(" ");
};
