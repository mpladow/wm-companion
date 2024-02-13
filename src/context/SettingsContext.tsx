import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export enum Language {
	"en",
	"es",
}
interface SettingsContextInterface {
	settings: SettingsProps;
	setLang: (lang: string) => void;
	setTwoPlayerMode: () => void;
	setShowStatlineSetting: (val?: boolean) => void;
}
interface SettingsProps {
	language: Language;
	showStatline: boolean;
	trackerTwoPlayerMode: boolean;
}
const SettingsContext = createContext<SettingsContextInterface>({} as SettingsContextInterface);

const SETTINGS_KEY = "wm_user_settings";
// get language
export const SettingsContextProvider = ({ children }: any) => {
	const { t, i18n } = useTranslation();
	const [language, setLanguage] = useState<Language>(Language.en);
	const [settings, setSettings] = useState<SettingsProps>({} as SettingsProps);
	const [showStatline, setShowStatline] = useState(true);
	const [trackerTwoPlayerMode, setTrackerTwoPlayerMode] = useState(false);
	const getStoredSettingsAsync = async () => {
		const _storedSettings = await AsyncStorage.getItem(SETTINGS_KEY, (result) => {
			console.log(result, "SettingsContext:: returned storedSettings");
		});
		return _storedSettings;
	};
	useEffect(() => {
		getStoredSettingsAsync().then((settings) => {
			if (settings) {
				const settingsObj: SettingsProps = JSON.parse(settings);
				setSettings(settingsObj);
				// set language
				console.log(`settings language to ${Language[settingsObj.language]}`);
				setLang(Language[settingsObj.language]);
				setTrackerTwoPlayerMode(settingsObj.trackerTwoPlayerMode);
			}
		});
	}, []);
	// get settings
	const setLang = (lang: string) => {
		console.log(lang, "Settings:: setLanguage");
		setLanguage(Language[lang as keyof typeof Language]);
		i18n.changeLanguage(lang);
	};
	const setShowStatlineSetting = (val?: boolean) => {
		console.log(!showStatline, "Settings:: setShowStatline");
		setShowStatline(val? val : !showStatline);
	};
	const setTwoPlayerMode = () => {
		console.log(trackerTwoPlayerMode, "tracker mode");
		setTrackerTwoPlayerMode(!trackerTwoPlayerMode);
		
	};
	useEffect(() => {
		// set to async storage
		const setAsyncStorage = async () => {
			const _settings = { ...settings };
			_settings.showStatline = showStatline;
			_settings.language = language;
			_settings.trackerTwoPlayerMode = trackerTwoPlayerMode;
			setSettings(_settings);
			await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(_settings));
		};
		setAsyncStorage();
	}, [language, trackerTwoPlayerMode, showStatline]);

	return (
		<SettingsContext.Provider value={{ settings, setLang, setTwoPlayerMode, setShowStatlineSetting }}>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettingsContext = () => {
	return useContext(SettingsContext);
};
