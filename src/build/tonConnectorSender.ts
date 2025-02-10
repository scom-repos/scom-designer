import { Address, beginCell, Sender, SenderArguments, SendMode, storeStateInit, TonConnector } from "@scom/ton-core";

export class TonConnectSender implements Sender {
  public provider: TonConnector.ITonConnect;
  readonly address?: Address;

  constructor(provider: TonConnector.ITonConnect) {
    this.provider = provider;
    if (provider.wallet)
      this.address = Address.parse(provider.wallet.account.address);
    else this.address = undefined;
  }

  async send(args: SenderArguments): Promise<void> {
    if (
      !(
        args.sendMode === undefined ||
        args.sendMode === SendMode.PAY_GAS_SEPARATELY
      )
    ) {
      throw new Error(
        'Deployer sender does not support `sendMode` other than `PAY_GAS_SEPARATELY`',
      );
    }

    console.log('sed  ', args.body?.toBoc().toString('base64'));

    await this.provider.sendTransaction({
      validUntil: Date.now() + 5 * 60 * 1000,
      messages: [
        {
          address: args.to.toString(),
          amount: args.value.toString(),
          payload: args.body?.toBoc().toString('base64'),
          stateInit: args.init
            ? beginCell()
              .storeWritable(storeStateInit(args.init))
              .endCell()
              .toBoc()
              .toString('base64')
            : undefined,
        },
      ],
    });
  }
}