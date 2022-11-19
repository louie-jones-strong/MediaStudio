class HistoryManager
{
	constructor()
	{
		this.Reset()
	}

	Reset()
	{
		if (this.ActionsStack != null)
		{
			for (let i = 0; i < this.ActionsStack.length; i++)
			{
				this.ActionsStack.pop().Remove()
			}
		}
		this.ActionsStack = []
		this.CurrentIndex = -1;
	}

	Undo()
	{
		if (this.CurrentIndex == 0)
		{
			return;
		}

		let current = this.ActionsStack[this.CurrentIndex];
		if (!current.Ended)
		{
			current.EndAction();
		}

		this.ActionsStack[this.CurrentIndex].Undo();

		this.SetCurrent(this.CurrentIndex - 1)
	}

	Redo()
	{
		if (this.CurrentIndex >= this.ActionsStack.length -1)
		{
			return;
		}

		this.ActionsStack[this.CurrentIndex].Redo();

		this.SetCurrent(this.CurrentIndex + 1)
	}

	Update()
	{

		if (MouseLeftOrRightPressed)
		{
			this.AddAction(new ImageAction())
		}
		else if (MouseLeftOrRightReleased)
		{
			let current = this.ActionsStack[this.CurrentIndex];
			if (!current.Ended)
			{
				current.EndAction();
			}
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
				this.ActionsStack.pop().Remove()
			}
		}


		this.ActionsStack.push(action)
		this.SetCurrent(this.CurrentIndex + 1)
	}

	SetCurrent(index)
	{
		if (this.CurrentIndex >= 0 && this.CurrentIndex < this.ActionsStack.length)
		{
			this.ActionsStack[this.CurrentIndex].SetIsCurrent(false);
		}

		this.CurrentIndex = index

		if (this.CurrentIndex >= 0 && this.CurrentIndex < this.ActionsStack.length)
		{
			this.ActionsStack[this.CurrentIndex].SetIsCurrent(true);
		}
	}
}
