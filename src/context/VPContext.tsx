import AsyncStorage from "@react-native-async-storage/async-storage";
import playerTypes, { Factions } from "@utils/constants";
import React, { useEffect, useMemo } from "react";
import { createContext, useContext, useState } from "react";

export type PlayerDetailsProps = {
	player: playerTypes;
	score: VPScoreProps[];
	faction?: number;
};
export type VPScoreProps = {
	id: string;
	sourceName: string;
	sourcePoints: number;
	isUnit: boolean; // if false, the source comes from victory points
	isItem: boolean;
	attachedItems?: VPScoreProps[];
	isHalfPoints?: boolean;
};

type VPContextInterface = {
	p1VpScore: VPScoreProps[];
	p2VpScore: VPScoreProps[];
	p1DefaultFaction?: number;
	p2DefaultFaction?: number;
	selectedPlayer: playerTypes;
	setPlayer: (player: playerTypes) => void;
	updateFaction: (player: playerTypes, faction: number) => void;
	updateScore: (score: VPScoreProps) => void;
	removeScore: (scoreId: string) => void;
	addScore: (core: VPScoreProps) => void;
	getP1TotalPoints: number;
	getP2TotalPoints: number;
	toggleHalfPoints: (id: string) => void;
};
const VPContext = createContext<VPContextInterface>({} as VPContextInterface);

const VP_KYS = {
	p1VpScore: "p1VpScore",
	p2VpScore: "p2VpScore",
	p1DefaultFaction: "p1DefaultFaction",
	p2DefaultFaction: "p2DefaultFaction",
};
export const VPContextProvider = ({ children }: any) => {
	const [p1VpScore, setP1VpScore] = useState<VPScoreProps[]>([] as VPScoreProps[]);
	const [p2VpScore, setP2VpScore] = useState<VPScoreProps[]>([] as VPScoreProps[]);
	const [p1VpFaction, setP1VpFaction] = useState<number | undefined>();
	const [p2VpFaction, setP2VpFaction] = useState<number | undefined>();

	const [selectedPlayer, setSelectedPlayer] = useState<playerTypes>("playerOne");
	const setPlayer = (player: playerTypes) => {
		setSelectedPlayer(player);
	};
	const getP1TotalPoints = useMemo(() => {
		let p1UnitsArr = p1VpScore.map((x) => (x.isHalfPoints ? Math.round(x.sourcePoints / 2) : x.sourcePoints));
		let res: number = 0;
		if (p1UnitsArr) {
			const p1UnitsScore = p1UnitsArr.reduce((partial, a) => partial + a, 0);
			// get total score for magic items
			let p1UnitUpgrades = p1VpScore.filter((x) => x.attachedItems && x.attachedItems?.length > 0);
			let p1UnitUpgradesArr = p1UnitUpgrades.map((x) => x.sourcePoints);
			const p1UnitUpgradesScore = p1UnitUpgradesArr.reduce((partial, a) => partial + a, 0);
			res = p1UnitsScore + p1UnitUpgradesScore;
		}
		return res; // + variable scores
	}, [p1VpScore]);

	const getP2TotalPoints = useMemo(() => {
		// PLAYER TWO
		let p2UnitsArr = p2VpScore.map((x) => (x.isHalfPoints ? Math.round(x.sourcePoints / 2) : x.sourcePoints));
		let res: number = 0;
		if (p2UnitsArr) {
			const p2UnitsScore = p2UnitsArr.reduce((partial, a) => partial + a, 0);
			// get total score for magic items
			let p2UnitUpgrades = p2VpScore.filter((x) => x.attachedItems && x.attachedItems?.length > 0);
			let p2UnitUpgradesArr = p2UnitUpgrades.map((x) => x.sourcePoints);
			let p2UnitUpgradesScore = p2UnitUpgradesArr.reduce((partial, a) => partial + 1, 0);
			res = p2UnitsScore + p2UnitUpgradesScore;
		}
		return res; // + variable scores
	}, [p2VpScore]);
	const updateFaction = (player: playerTypes, faction: number) => {
		// clear vp object and set a new faction
		if (player == "playerOne") {
			setP1VpFaction(faction);
		} else {
			setP2VpFaction(faction);
		}
	};
	const resetScore = () => {
		const newScoreP1Obj: PlayerDetailsProps = { player: "playerOne", score: [] as VPScoreProps[], faction: 0 };
		const newScorep2Obj: PlayerDetailsProps = { player: "playerTwo", score: [] as VPScoreProps[], faction: 0 };
	};
	const updateScore = (score: VPScoreProps) => {
		// update a unit to half or full points. change magic items, etc
	};
	const removeScore = (scoreId: string) => {
		selectedPlayer == "playerOne"
			? setP1VpScore((current) => current.filter((x) => x.id != scoreId))
			: setP2VpScore((current) => current.filter((x) => x.id != scoreId));
		// update array to remove this score
	};
	const toggleHalfPoints = (scoreId: string) => {
		let arrToUpdate: VPScoreProps[];

		if (selectedPlayer == "playerOne") {
			arrToUpdate = p1VpScore;
		} else {
			arrToUpdate = p2VpScore;
		}
		const scoreInArr = arrToUpdate.find((x) => x.id == scoreId);
		if (scoreInArr?.sourceName == "Additional Points") {
			return;
		}

		const scoreToUpdateIndex = arrToUpdate.findIndex((x) => x.id == scoreId);
		const updatedScore: VPScoreProps = {
			...arrToUpdate[scoreToUpdateIndex],
			isHalfPoints: !arrToUpdate[scoreToUpdateIndex].isHalfPoints,
		};
		// TODO: refactor b elow code
		if (selectedPlayer == "playerOne") {
			setP1VpScore([
				...arrToUpdate.slice(0, scoreToUpdateIndex),
				updatedScore,
				...arrToUpdate.slice(scoreToUpdateIndex + 1),
			]);
		} else {
			setP2VpScore([
				...arrToUpdate.slice(0, scoreToUpdateIndex),
				updatedScore,
				...arrToUpdate.slice(scoreToUpdateIndex + 1),
			]);
		}
	};
	const addScore = (score: VPScoreProps) => {
		// append this score to the array
		selectedPlayer == "playerOne" ? setP1VpScore([...p1VpScore, score]) : setP2VpScore([...p2VpScore, score]);
	};
	useEffect(() => {
		getScoresFromStorage();
	}, []);

	useEffect(() => {
		console.log(p2VpScore, "1SCORE");
		console.log(p2VpFaction, "1FACTION");
		if (p1VpScore && p1VpFaction) {
			const p1State: PlayerDetailsProps = {
				player: "playerOne",
				score: p1VpScore,
				faction: p1VpFaction,
			};
			console.log(p1State, "p1State");
			updateStorage(p1State);
		}
	}, [p1VpScore, p1VpFaction]);
	useEffect(() => {
		console.log(p2VpScore, "2SCORE");
		console.log(p2VpFaction, "2FACTION");
		if (p2VpScore && p2VpFaction) {
			const p2State: PlayerDetailsProps = {
				player: "playerTwo",
				score: p2VpScore,
				faction: p2VpFaction,
			};
			console.log(p2State, "p2State");

			updateStorage(p2State);
		}
	}, [p2VpScore, p2VpFaction]);

	const updateStorage = async (score: PlayerDetailsProps) => {
		try {
			console.log(JSON.stringify(score.score), "SCORE IN UPDTTE STORAGE");
			if (selectedPlayer == "playerOne") {
				await AsyncStorage.setItem(`${VP_KYS.p1VpScore}`, JSON.stringify(score.score));
				await AsyncStorage.setItem(`${VP_KYS.p1DefaultFaction}`, JSON.stringify(score.faction));
			}
			if (selectedPlayer == "playerTwo") {
				await AsyncStorage.setItem(`${VP_KYS.p2VpScore}`, JSON.stringify(score.score));
				await AsyncStorage.setItem(`${VP_KYS.p2DefaultFaction}`, JSON.stringify(score.faction));
			}
		} catch (e) {}
	};

	const getScoresFromStorage = async () => {
		try {
			//await AsyncStorage.clear();

			const p1VpScore = await AsyncStorage.getItem(`${VP_KYS.p1VpScore}`);
			const p2VpScore = await AsyncStorage.getItem(`${VP_KYS.p2VpScore}`);
			const p1VpFaction = await AsyncStorage.getItem(`${VP_KYS.p1DefaultFaction}`);
			const p2VpFaction = await AsyncStorage.getItem(`${VP_KYS.p2DefaultFaction}`);

			const p1VpScoreObj: VPScoreProps[] = p1VpScore && JSON.parse(p1VpScore);
			const p2VpScoreObj: VPScoreProps[] = p2VpScore && JSON.parse(p2VpScore);

			const p1VpFactionObj: number = p1VpFaction && JSON.parse(p1VpFaction);
			const p2VpFactionObj: number = p2VpFaction && JSON.parse(p2VpFaction);

			if (p1VpScoreObj != null) {
				console.log(`${p1VpScore} SETTING P1`);
				setP1VpScore(p1VpScoreObj);
				setP1VpFaction(p1VpFactionObj);
			}

			if (p2VpScoreObj != null) {
				console.log(`${p2VpScore} SETTING P2`);

				setP2VpScore(p2VpScoreObj);
				setP2VpFaction(p2VpFactionObj);
			}
		} catch (e) {}
	};
	return (
		<VPContext.Provider
			value={{
				p1VpScore,
				p2VpScore,
				p1DefaultFaction: p1VpFaction,
				p2DefaultFaction: p2VpFaction,
				updateFaction,
				updateScore,
				removeScore,
				addScore,
				selectedPlayer,
				setPlayer,
				getP1TotalPoints,
				getP2TotalPoints,
				toggleHalfPoints,
			}}
		>
			{children}
		</VPContext.Provider>
	);
};

export const useVictoryPoints = () => React.useContext(VPContext);
