// @ts-nocheck
import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CASYXS2TY4HMNTQQ53R5AKNJCMR3LCDLLQBAV4TTR6U4JELZM24J6VC4",
  }
} as const


export interface Client {
  /**
   * Construct and simulate a get_question transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_question: ({id}: {id: u32}, options?: MethodOptions) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a submit_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Submit answers. Evaluates correctly matching answers and updates the leaderboard.
   */
  submit_batch: ({solver, answers}: {solver: string, answers: Array<readonly [u32, string]>}, options?: MethodOptions) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a pay_entry_fee transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Pay entry fee in XLM or any token to participate.
   */
  pay_entry_fee: ({player, token_address, amount}: {player: string, token_address: string, amount: i128}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_leaderboard transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_leaderboard: (options?: MethodOptions) => Promise<AssembledTransaction<Array<readonly [string, u32]>>>

  /**
   * Construct and simulate a create_quiz_batch transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Admin updates the quiz batch.
   */
  create_quiz_batch: ({items}: {items: Array<readonly [u32, string, string]>}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAMZ2V0X3F1ZXN0aW9uAAAAAQAAAAAAAAACaWQAAAAAAAQAAAABAAAAEA==",
        "AAAAAAAAAFFTdWJtaXQgYW5zd2Vycy4gRXZhbHVhdGVzIGNvcnJlY3RseSBtYXRjaGluZyBhbnN3ZXJzIGFuZCB1cGRhdGVzIHRoZSBsZWFkZXJib2FyZC4AAAAAAAAMc3VibWl0X2JhdGNoAAAAAgAAAAAAAAAGc29sdmVyAAAAAAATAAAAAAAAAAdhbnN3ZXJzAAAAA+oAAAPtAAAAAgAAAAQAAAAQAAAAAQAAAAQ=",
        "AAAAAAAAADFQYXkgZW50cnkgZmVlIGluIFhMTSBvciBhbnkgdG9rZW4gdG8gcGFydGljaXBhdGUuAAAAAAAADXBheV9lbnRyeV9mZWUAAAAAAAADAAAAAAAAAAZwbGF5ZXIAAAAAABMAAAAAAAAADXRva2VuX2FkZHJlc3MAAAAAAAATAAAAAAAAAAZhbW91bnQAAAAAAAsAAAAA",
        "AAAAAAAAAAAAAAAPZ2V0X2xlYWRlcmJvYXJkAAAAAAAAAAABAAAD6gAAA+0AAAACAAAAEwAAAAQ=",
        "AAAAAAAAAB1BZG1pbiB1cGRhdGVzIHRoZSBxdWl6IGJhdGNoLgAAAAAAABFjcmVhdGVfcXVpel9iYXRjaAAAAAAAAAEAAAAAAAAABWl0ZW1zAAAAAAAD6gAAA+0AAAADAAAABAAAABAAAAAQAAAAAA==" ]),
      options
    )
  }
  public readonly fromJSON = {
    get_question: this.txFromJSON<string>,
        submit_batch: this.txFromJSON<u32>,
        pay_entry_fee: this.txFromJSON<null>,
        get_leaderboard: this.txFromJSON<Array<readonly [string, u32]>>,
        create_quiz_batch: this.txFromJSON<null>
  }
}