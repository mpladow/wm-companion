import { useChangeLogs } from '@hooks/getChangelogs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Updates from 'expo-updates';
import { createContext, useContext, useEffect, useState } from 'react';
import { CHANGE_LOG_DISMISSED } from 'src/constants/persistenceKeys';
import { ChangeLog } from 'src/types/data/changelog';
type UpdateCheckerContextType = {
  changelog?: ChangeLog;
  recentlyDismissedChangeLog?: string;
  dismissChangeLog: () => void;
  clearDismissedDEBUG: () => void;
  isReady: boolean;
};

const UpdateCheckerContext = createContext<UpdateCheckerContextType>(
  {} as UpdateCheckerContextType,
);

export const UpdateCheckerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [recentlyDismissedChangeLog, setRecentlyDismissedChangeLog] = useState<string>();
  const [changelog, setChangelog] = useState<ChangeLog | undefined>();
  const { getChangeLogsByVersion } = useChangeLogs();
  const [isReady, setIsReady] = useState(false);
  const [updatesComplete, setUpdatesComplete] = useState(false);
  const [changelogsComplete, setChangelogsComplete] = useState(false);
  const version = Constants.expoConfig?.version;

  // when everything is load, app is ready
  useEffect(() => {
    if (changelogsComplete) {
      setIsReady(true);
    }
  }, [updatesComplete, changelogsComplete]);
  // on load, check local storage for whether changelog has already been dismissed
  useEffect(() => {
    getStorageItems();
  }, [version]);

  useEffect(() => {
    onCheckForUpdate();
  }, []);

  async function onCheckForUpdate() {
    try {
      const update = await Updates.checkForUpdateAsync();
      console.log('🚀 ~ onCheckForUpdate ~ update:', update);
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        setUpdatesComplete(true);
        // Prompt user to reload or use reloadAsync() to apply immediately
        await Updates.reloadAsync();
      }
    } catch (error) {
      // Handle or log error
      console.error(`Error fetching latest update: ${error}`);
    }
  }

  const getStorageItems = async () => {
    if (version) {
      await AsyncStorage.getItem(CHANGE_LOG_DISMISSED).then((res) => {
        if (res) {
          const resObj = JSON.parse(res);
          setRecentlyDismissedChangeLog(resObj);
        }
        const currentChangeLog = getChangeLogsByVersion(version);
        if (currentChangeLog) {
          console.log('---CHANGELOG FOUND');
        } else {
          console.log('---NO CHANGELOG FOUND');
        }
        setChangelog(currentChangeLog);
        setChangelogsComplete(true);
      });
    }
  };

  // if dismissed is false AND current version has a change log, then show cl
  const dismissChangeLog = () => {
    console.log(`setting ${CHANGE_LOG_DISMISSED} to ${version}`);
    AsyncStorage.setItem(CHANGE_LOG_DISMISSED, JSON.stringify(version));
    setRecentlyDismissedChangeLog(version);
  };

  const clearDismissedDEBUG = () => {
    AsyncStorage.removeItem(CHANGE_LOG_DISMISSED);
  };
  // if dismissed is true AND current version has a change

  // -- if no, then check current current version with changelogs.
  // if one exists that matches the current version, then set ChangeLog.

  return (
    <UpdateCheckerContext.Provider
      value={{
        isReady,
        changelog,
        recentlyDismissedChangeLog,
        dismissChangeLog,
        clearDismissedDEBUG,
      }}>
      {children}
    </UpdateCheckerContext.Provider>
  );
};

export const useUpdateChecker = () => {
  const context = useContext(UpdateCheckerContext);
  if (context === undefined) {
    throw new Error('useUpdateChecker must be within UpdateCheckerProvider');
  }
  return context;
};
