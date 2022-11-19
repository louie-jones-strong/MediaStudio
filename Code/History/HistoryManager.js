class HistoryManager
{
	constructor()
	{
		this.Reset()
	}

	Reset()
	{
		this.ActionsStack = []
		this.CurrentIndex = -1;
	}

	Undo()
	{
		if (this.CurrentIndex == 0)
		{
			return;
		}

		this.ActionsStack[this.CurrentIndex].Undo();

		this.CurrentIndex -= 1;
	}

	Redo()
	{
		if (this.CurrentIndex >= this.ActionsStack.length)
		{
			return;
		}

		this.ActionsStack[this.CurrentIndex].Redo();

		this.CurrentIndex += 1
	}

	Update()
	{

		if (MouseLeftOrRightPressed)
		{
			this.AddAction(new ImageAction())
		}
	}

	AddAction(action)
	{
		if (this.CurrentIndex >= 0)
		{
			let current = this.ActionsStack[this.CurrentIndex];
			if (!current.Ended)
			{
				current.EndAction();
			}
		}

		if (this.CurrentIndex < this.ActionsStack.length - 1)
		{
			for (let i = this.ActionsStack.length - 1; i > this.CurrentIndex; i--)
			{
				this.ActionsStack.pop()
			}
		}


		this.ActionsStack.push(action)
		this.CurrentIndex += 1;
	}
}
