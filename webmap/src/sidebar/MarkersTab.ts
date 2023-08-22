import {Pl3xMap} from "../Pl3xMap";
import {createSVGIcon, isset} from "../util/Util";
import BaseTab from "./BaseTab";
import '../svg/marker_point.svg';
import {Lang} from "../settings/Lang";
import {MarkerLayer} from "../layergroup/MarkerLayer";
import {Marker} from "../marker/Marker";
import {MarkerOptions} from "../marker/options/MarkerOptions";
import * as L from "leaflet";
import {Settings} from "../settings/Settings";
import {PlayerManager} from "../player/PlayerManager";
import {Player} from "../player/Player";
import {Icon} from "../marker/Icon";
import {IconOptions} from "leaflet";

export default class MarkersTab extends BaseTab {
    private readonly _markers: Map<Marker, any> = new Map();
    private readonly _skeleton: HTMLParagraphElement;
    private readonly _list: HTMLFieldSetElement;
    private readonly _heading: HTMLHeadingElement;

    constructor(pl3xmap: Pl3xMap) {
        super(pl3xmap, 'markers');

        const lang: Lang = pl3xmap.settings!.lang;

        this._button.appendChild(createSVGIcon('marker_point'));
        this._button.setAttribute('aria-label', lang.markers.label);
        this._button.title = lang.markers.label;

        // this._content.innerHTML = `<h2>${lang.markers.label}</h2>`;

        this._heading = L.DomUtil.create('h2', '', this._content);
        this._heading.innerText = lang.markers.label;
        this._heading.id = 'markers-heading';

        this._skeleton = L.DomUtil.create('p', '', this._content);
        this._skeleton.innerText = lang.markers.value;
        this._skeleton.tabIndex = -1;

        this._list = L.DomUtil.create('fieldset', 'menu', this._content);
        this._list.setAttribute('aria-labelledby', 'markers-heading');
        this._list.setAttribute('role', 'radiogroup');

        this.initEvents();

        this._update();
    }

    private initEvents(): void {
        addEventListener('markeradded', (e: CustomEvent<Marker>): void => {
            this.createListItem(e.detail);
            // this._update();
        });
        addEventListener('markerremoved', (e: CustomEvent<Marker>): void => {
            // this.removeListItem(e.detail);
            // this._update();
        });
    }

    private _update(): void {
        // const settings: Settings | undefined = this._pl3xmap.settings;
        //
        // const online: string = String(isset(settings?.players) ? Object.keys(settings!.players).length : '???');
        // const max: string = String(settings?.maxPlayers ?? '???');
        //
        // const title: any = settings?.lang.players?.label
        //         .replace('<online>', online)
        //         .replace('<max>', max)
        //     ?? 'Players';
        //
        // this._heading.innerText = title;
        // this._button.title = title;
    }

    private buildLayers(markerLayers: MarkerLayer[] | undefined): string | undefined {
        if (markerLayers != undefined) {
            let markerOverviewHTML = `<div>`
            for (let layer of markerLayers) {
                markerOverviewHTML += `<div>
<header>${layer.label} (${layer.markers.size})</header>
<div>${this.buildMarkers(layer.markers)}</div>
</div>`
            }

            return undefined;
        }
    }

    private buildMarkers(markers: Map<string, Marker>): string {
        let markerList = ``;
        for (const [key, marker] of markers) {
            // let marker = genericMarker as Rectangle | Polyline | MultiPolyline | Icon | Polygon | Circle | MultiPolygon | Ellipse | undefined;
            let markerOptions = marker.marker.options as MarkerOptions;
            let label: string | undefined;
            if (markerOptions.tooltip) {
                label = markerOptions.tooltip.content
            } else if (markerOptions.popup) {
                label = markerOptions.popup.content
            }
            if (label)
                markerList += `<div>${label}</div>`;
        }

        return markerList;
    }

    private createListItem(marker: Marker) {
        if(marker instanceof Icon){
            const iconMarker = marker as Icon;
            const iconMarkerOptions = iconMarker.marker.options as IconOptions;
            iconMarkerOptions
        }
        // console.log(`Added Marker: ${JSON.stringify(marker)}`)
        // let markerLayers = this._pl3xmap.worldManager.currentWorld?.markerLayers;
        // let markerLayersHTML = this.buildLayers(markerLayers);
        // if (markerLayersHTML != undefined) {
        //     this._content.innerHTML = markerLayersHTML;
        // }

        const input: HTMLInputElement = L.DomUtil.create('input', 'markers'),
            label: HTMLLabelElement = L.DomUtil.create('label', '');

        // label.style.backgroundImage = `url('images/skins/3D/${player.uuid}.png')`;
        label.innerText = marker.key;
        input.id = label.htmlFor = `${marker.key}`;
        input.type = 'radio';
        input.name = 'marker';
        input.checked = false;
        input.addEventListener('click', async (): Promise<void> => {
            // const manager: PlayerManager = this._pl3xmap.playerManager;
            // const player: Player | undefined = manager.players.get(input.id);
            // if (player === manager.follow) {
            //     manager.follow = undefined;
            // } else {
            //     manager.follow = player;
            // }
            // manager.updateFollow();
            console.log("Should go to marker on map")
        });

        this._markers.set(marker, {
            input,
            label
        });

        this._skeleton.hidden = true;
        this._list.appendChild(input);
        this._list.appendChild(label);

        Array.from(this._markers.values()).sort((a: any, b: any): 1 | -1 | 0 => {
            return a.label.innerText < b.label.innerText ? -1 : (a.label.innerText > b.label.innerText ? 1 : 0);
        }).forEach((item: any): void => {
            item.input.remove();
            item.label.remove();
            this._list.appendChild(item.input);
            this._list.appendChild(item.label);
        });
    }
}



