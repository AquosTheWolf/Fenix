import FenixClient from "../lib/FenixClient";

export default class BaseEvent {
	public name: string;
	public event: string;
	public enabled: boolean;
	constructor(public client: FenixClient, options: { name: string; event: string; enabled: boolean }) {
		this.client = client;
		this.name = options.name;
		this.event = options.event;
		this.enabled = options.enabled;
	}
	public run(...args: any[]) {
		throw new Error("Method not implemented.");
	}
}
