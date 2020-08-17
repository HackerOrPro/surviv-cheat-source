var Plugin = class {
    constructor() {
        this._enabled = true
        this.name = "timer"
        this.UI = {
            name: "Grenade Timer",
            description: "",
        }
        this._options = []
        this.lastTime = Date.now()
    }

    option(o) {
        let op
        try {
            op = this._options.filter(k => k.name === o)[0].value
        } catch (e) {
            op = false
        }
        return op
    }

    setOption(o, v) {
        try {
            this._options.filter(k => k.name === o)[0].value = v
        } catch (e) {}
    }

    get enabled() {
        return this._enabled
    }

    set enabled(t) {
        this._enabled = t
    }

    loop(dataAccessor, player, input, data, plugins) {
        var elapsed = (Date.now() - this.lastTime) / 1000;
        if (3 !== dataAccessor.GetPlayerWeapIdx(player) ||
            player.throwableState !== "cook"
        )
            return (
                (this.showing = false),
                this.timer && this.timer.destroy(),
                (this.timer = false)
            );
        var type = dataAccessor.GetPlayerWeaponType(player);
        var time = (data.items[type] || {}).fuseTime || 4
        if(time > 60) {
            return;
        }
        if(elapsed > time) {
            this.showing = false;
        }
        if(!this.showing) {
            if(this.timer) {
                this.timer.destroy();
            }
            this.timer = new (Object.values(data.pieTimer)[0])();
            dataAccessor.Pixi().stage.addChild(this.timer.container);
            this.timer.start("Grenade", 0, time);
            this.showing = true;
            this.lastTime = Date.now();
            return;
        }
        this.timer.update(elapsed - this.timer.elapsed, dataAccessor.Camera());
    }
}

module.exports = new Plugin()
