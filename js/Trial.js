function Trial(position) {

    this._position = position;
    this._secondTrialInTarget = TargetKind.None;

    // GETTERS / SETTERS

    this.GetPosition = function () {
        return this._position;
    }

    this.SetPosition = function (val) {
        this._position = val;
    }

    this.GetSecondTrialInTarget = function () {
        return this._secondTrialInTarget;
    }

    this.SetSecondTrialInTarget = function (val) {
        this._secondTrialInTarget = val;
    }

}