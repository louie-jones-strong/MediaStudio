class HashSet
{
	constructor()
	{
		this.Clear();
	}

	Add(value)
	{
		this.Dictionary[value] = true;
	}

	Contains(value)
	{
		return this.Dictionary[value] == true;
	}

	Clear()
	{
		this.Dictionary = {};
	}
}