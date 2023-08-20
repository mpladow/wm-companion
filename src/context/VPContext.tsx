import AsyncStorage from "@react-native-async-storage/async-storage";
import playerTypes, { Factions } from "@utils/constants";
import React, { useEffect, useMemo } from "react";
import { createContext, useContext, useState } from "react";
import uuid from "uuid-random";

export type SaveGameProps = {
	saveGameId?: string;
	playerDetailScores: PlayerDetailsProps[];
	dateSaved: string;
};
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
	useOnePlayerMode: boolean;
	toggleOnePlayerMode: () => void;
	allSaves: SaveGameProps[];
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
	const [useOnePlayerMode, setUseOnePlayerMode] = useState(false);
	const [selectedPlayer, setSelectedPlayer] = useState<playerTypes>("playerOne");
	const [curentSaveGameId, setCurentSaveGameId] = useState<string>("1");
	const [allSaves, setAllSaves] = useState<SaveGameProps[]>([]);


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
			let p1TotalUpgradesArr: number[] = [];
			p1UnitUpgrades.map((upgrade) => upgrade.attachedItems?.map((x) => p1TotalUpgradesArr.push(x.sourcePoints)));
			const p1UnitUpgradesScore = p1TotalUpgradesArr.reduce((partial, a) => partial + a, 0);

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
			let p1TotalUpgradesArr: number[] = [];
			p2UnitUpgrades.map((upgrade) => upgrade.attachedItems?.map((x) => p1TotalUpgradesArr.push(x.sourcePoints)));
			const p1UnitUpgradesScore = p1TotalUpgradesArr.reduce((partial, a) => partial + a, 0);

			res = p2UnitsScore + p1UnitUpgradesScore;
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
		//getAllSavesFromStorage();
	}, []);
	useEffect(() => {
		getScoresForSaveGameId();
	}, [curentSaveGameId]);

	useEffect(() => {
		if (p1VpScore && p1VpFaction) {
			const p1State: PlayerDetailsProps = {
				player: "playerOne",
				score: p1VpScore,
				faction: p1VpFaction,
			};
			updateStorage(p1State);
		}
	}, [p1VpScore, p1VpFaction]);
	useEffect(() => {
		if (p2VpScore && p2VpFaction) {
			const p2State: PlayerDetailsProps = {
				player: "playerTwo",
				score: p2VpScore,
				faction: p2VpFaction,
			};

			updateStorage(p2State);
		}
	}, [p2VpScore, p2VpFaction]);

	// updat storage
	const updateStorage = async (score: PlayerDetailsProps) => {
		if (selectedPlayer == "playerOne") {
			const p2Score: PlayerDetailsProps = {
				player: "playerTwo",
				score: p2VpScore,
				faction: p2VpFaction,
			};
			const saveState: SaveGameProps = {
				saveGameId: curentSaveGameId,
				playerDetailScores: [score, p2Score],
				dateSaved: new Date().toISOString(),
			};
			await AsyncStorage.setItem(`SAVEGAME-${curentSaveGameId}`, JSON.stringify(saveState));
		}
		if (selectedPlayer == "playerTwo") {
			const p1Score: PlayerDetailsProps = {
				player: "playerOne",
				score: p1VpScore,
				faction: p1VpFaction,
			};
			const saveState: SaveGameProps = {
				saveGameId: curentSaveGameId,
				playerDetailScores: [p1Score, score],
				dateSaved: new Date().toISOString(),
			};
			await AsyncStorage.setItem(`SAVEGAME-${curentSaveGameId}`, JSON.stringify(saveState));

			// update array
		}
	};

	const getAllSavesFromStorage = async () => {
		try {
			const keys = await AsyncStorage.getAllKeys();
			let filteredKeys = keys && keys.filter((x) => x.includes("SAVE"));
			console.log(filteredKeys, "filtered keys");
			if (keys) {
				const result = await AsyncStorage.multiGet(keys);
				if (result) {
					const saveGames: SaveGameProps[] = result.map((req) => {
						if (req[1]) return JSON.parse(req[1]);
					});
					console.log(result, "RESULT FROM ALL SAVES");
					// const res = saveGames.map((x) => {
					// 	return { id: x.saveGameId, date: x.dateSaved };
					// });
					setAllSaves(saveGames);
				}
			}
		} catch (e) {
			console.log("VPContext:: getAllSavesFromStorage:: error ", e);
		}
	};

	const getScoresForSaveGameId = async () => {
		// getting saves for saveGameId
		try {
			const scoreFromStorage = await AsyncStorage.getItem(`SAVEGAME-${curentSaveGameId}`);
			const currentScoreObj: SaveGameProps = scoreFromStorage && JSON.parse(scoreFromStorage);

			const p1VpScore = currentScoreObj.playerDetailScores?.find((x) => x.player == "playerOne");
			const p2VpScore = currentScoreObj.playerDetailScores?.find((x) => x.player == "playerTwo");

			if (p1VpScore) {
				setP1VpScore(p1VpScore.score);
				setP1VpFaction(p1VpScore.faction);
			}
			if (p2VpScore) {
				setP2VpScore(p2VpScore.score);
				setP2VpFaction(p2VpScore.faction);
			}
		} catch (e) {
			console.log(e, "VPContext -- not found");
		}
	};
	const toggleOnePlayerMode = () => {
		setUseOnePlayerMode(!useOnePlayerMode);
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
				useOnePlayerMode,
				toggleOnePlayerMode,
				allSaves,
			}}
		>
			{children}
		</VPContext.Provider>
	);
};

export const useVictoryPoints = () => React.useContext(VPContext);
