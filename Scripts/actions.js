var Actions = function(parentClass){

    this.onStartClick = function()
    {
        stateMachine.changeState(stateMachine.State.GAME_STATE);
    }

    this.onHelpClick = function()
    {
        stateMachine.changeState(stateMachine.State.HELP_STATE);
    }

    this.onExitClick = function()
    {
        if (stateMachine.currState == stateMachine.State.GAME_STATE)
            stateMachine.changeState(State.MENU_STATE);
        else if (stateMachine.currState == stateMachine.State.HELP_STATE)
            stateMachine.changeState(stateMachine.State.GAME_STATE);
    }

    this.onTryAgainClick = function()
    {
        traps.trapsArray = [];
        collidableTiles = [];
        stateMachine.changeState(stateMachine.State.GAME_STATE);
    }

    this.onMouseClick = function()
    {
        for (var i = 0; i < activeBtns.length; i++)
        {
            if (activeBtns[i].over == true)
            {
                activeBtns[i].click();
                break;
            }
        }
    }

}
