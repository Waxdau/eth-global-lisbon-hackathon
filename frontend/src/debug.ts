import PaymentChannel from './PaymentChannel';
import AppContext from './AppContext';
import Channel from './utils/Channel';

const globalRecord = globalThis as Record<string, unknown>;

globalRecord.Channel = Channel;
globalRecord.PaymentChannel = PaymentChannel;

AppContext.getSingleton().then((appContext) => {
  globalRecord.appContext = appContext;
});
