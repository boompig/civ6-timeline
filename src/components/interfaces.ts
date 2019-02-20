export interface IMoment {
	Turn: number;
	Id: number;
	Type: string;
	ActingPlayer: number;
	// instance-specific string that has a bunch of useful information
	InstanceDescription: string;
}

export interface IPlayer {
	Id: number;
	// long pretty description
	CivilizationDescription: string;
	// pretty discription
	CivilizationShortDescription: string;
	// whether human, AI of major civ, or CityState
	LeaderType: string;
	LeaderName: string;
}

export interface ITimelineData {
	Players: IPlayer[];
	Moments: IMoment[];
}
