import { CognitoAuthAdapter } from "../auth/cognitoAuthAdapter";
import { LocalStorageAdapter } from "../storage/localStorageAdapter";
import { WebCryptoAdapter } from "../crypto/webCryptoAdapter";
import { StartAuthUseCase } from "../../application/usecases/auth/startAuth";
import { HandleCallbackUseCase } from "../../application/usecases/auth/handleCallback";
import { SignOutUseCase } from "../../application/usecases/auth/signOut";
import { GetSessionUseCase } from "../../application/usecases/auth/getSession";

const authPort = new CognitoAuthAdapter();
const storagePort = new LocalStorageAdapter();
const cryptoPort = new WebCryptoAdapter();

export const authContainer = {
  startAuthUseCase: new StartAuthUseCase({ authPort, storagePort, cryptoPort }),
  handleCallbackUseCase: new HandleCallbackUseCase({ authPort, storagePort }),
  signOutUseCase: new SignOutUseCase({ authPort, storagePort }),
  getSessionUseCase: new GetSessionUseCase({ storagePort }),
};
