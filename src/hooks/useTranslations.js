import Translations from "../translations/translations.json";

const useTranslations = () => {
  const userLanguage = localStorage.getItem("connectLanguage");
  const englishLanguages = [
    "en-029",
    "en-Au",
    "en-BZ",
    "en-CA",
    "en-GB",
    "en-IE",
    "en-IN",
    "en-JM",
    "en-NZ",
    "en-PH",
    "en-TT",
    "en-US",
    "en-ZA",
    "en-ZW",
  ];
  const frenchLanguages = [
    "fr-BE",
    "fr-CA",
    "fr-CH",
    "fr-FR",
    "fr-LU",
    "fr-MC",
    "fr-SN",
  ];
  const language = userLanguage
    ? userLanguage
    : englishLanguages.includes(navigator.language)
    ? "english"
    : frenchLanguages.includes(navigator.language)
    ? "french"
    : "english";

  return Translations[language];
};

export default useTranslations;
