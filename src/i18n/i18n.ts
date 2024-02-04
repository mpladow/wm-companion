import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { commonEn, builderEn, homeEn, trackerEn, chartsEn, unitsEn, formsEn } from "./en";
import { commonEs, trackerEs, builderEs, homeEs, chartsEs, unitsEs, formsEs } from "./es";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	en: {
		common: commonEn,
		builder: builderEn,
		tracker: trackerEn,
		home: homeEn,
		charts: chartsEn,
		units: unitsEn,
		forms: formsEn
	},
	es: {
		common: commonEs,
		tracker: trackerEs,
		builder: builderEs,
		home: homeEs,
		charts: chartsEs,
		units: unitsEs,
		forms: formsEs
	},
};

i18n.use(initReactI18next) // passes i18n down to react-i18next
	.init({
		resources,
		// fallbackLng: "en",
		lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
		// you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
		// if you're using a language detector, do not define the lng option
		ns: ["common", "builder", "tracker", "home", "charts", "units", "forms"],
		interpolation: {
			escapeValue: false, // react already safes from xss
		},
		parseMissingKeyHandler: (key: string) => {
			return `Translation needed: "${key}"`;
		},
	});

export default i18n;
