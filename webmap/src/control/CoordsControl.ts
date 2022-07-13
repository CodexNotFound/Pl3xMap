import * as L from "leaflet";
import {Control, LeafletMouseEvent, Point} from "leaflet";
import {Pl3xMap} from "../Pl3xMap";

export class CoordsControl extends Control {
    private _pl3xmap: Pl3xMap;
    private _dom: HTMLDivElement = L.DomUtil.create('div');
    private _x: number = 0;
    private _z: number = 0;

    constructor(pl3xmap: Pl3xMap) {
        super();
        this._pl3xmap = pl3xmap;
        super.options = {
            position: 'bottomleft'
        };
    }

    onAdd(): HTMLDivElement {
        this._dom = L.DomUtil.create('div', 'leaflet-control-layers coordinates');
        this._pl3xmap.map.addEventListener('mousemove', (event: LeafletMouseEvent) => this.update(this._pl3xmap.toPoint(event.latlng)));
        this.update(new Point(0, 0));
        return this._dom;
    }

    private update(point: Point): void {
        this._x = Math.round(point.x);
        this._z = Math.round(point.y);
        this._dom.innerHTML = this._pl3xmap.lang.coords
            .replace(/<x>/g, this._x.toString())
            .replace(/<z>/g, this._z.toString());
    }
}