const EditGrabRadius = 20;

class EditableShapeTool extends Tool
{
	constructor()
	{
		super();
		//set an icon and a name for the object
		this.Name = "Editable Shape Tool";
		this.Id = "Editable_Shape_Tool";
		this.Icon = "assets/EditableShapeTool.png";
		this.IsEditMode = false;
		this.SelectedPoint = -1;

		this.PointList = [];
	}

	GetFooterHtml()
	{
		let footerHtml = super.GetFooterHtml();

		if (this.PointList.length < 3)
		{
			footerHtml += "<p>Click and release to add points like freehand</p>";
		}
		else
		{
			footerHtml += "<p>Select Edit icon to drag points</p>";
			footerHtml += "<p>Select Tick icon to complete</p>";
		}
		return footerHtml;
	}

	Draw()
	{
		super.Draw();

		if(MouseLeftOrRightPressed && Helpers.PosOnCanvas(MousePosX, MousePosY))
		{
			if (this.IsEditMode)
			{
				for (let i = 0; i < this.PointList.length; i++)
				{
					const point = this.PointList[i];
					if (dist(MousePosX, MousePosY, point.x, point.y) <= EditGrabRadius)
					{
						this.SelectedPoint = i;
						break;
					}
				}

				if (this.SelectedPoint >= 0 && this.SelectedPoint < this.PointList.length)
				{
					this.PointList[this.SelectedPoint].x = MousePosX;
					this.PointList[this.SelectedPoint].y = MousePosY;
				}
			}
			else
			{
				this.PointList.push({x: MousePosX, y:MousePosY});
			}
		}

		this.DrawPointList();
	}


	// this removed redundant points while drawing them
	DrawPointList()
	{
		Layers.CurrentImg.updatePixels();

		if (this.PointList.length <= 0)
		{
			return;
		}
		Layers.CurrentImg.push();

		Layers.CurrentImg.noFill();
		Layers.CurrentImg.beginShape();

		let lastPoint = 0;
		Layers.CurrentImg.vertex(this.PointList[lastPoint].x, this.PointList[lastPoint].y);

		let loop = 1;
		while (loop < this.PointList.length)
		{
			const point = this.PointList[loop];

			let distanceToLastPoint = dist(this.PointList[lastPoint].x, this.PointList[lastPoint].y, point.x, point.y);

			if (distanceToLastPoint <= (EditGrabRadius / 2))
			{
				this.PointList.splice(loop, 1);
				this.SelectedPoint = lastPoint;
			}
			else
			{
				lastPoint = loop;
				vertex(this.PointList[lastPoint].x, this.PointList[lastPoint].y)
				loop += 1;
			}
		}
		Layers.CurrentImg.endShape(CLOSE);

		Layers.CurrentImg.pop();

		if (this.IsEditMode)
		{
			for (let index = 0; index < this.PointList.length; index++)
			{
				const point = this.PointList[index];
				Layers.CurrentImg.push();
				Layers.CurrentImg.strokeWeight(3);
				Layers.CurrentImg.noFill();
				Layers.CurrentImg.stroke("red");
				Layers.CurrentImg.ellipse(point.x, point.y, EditGrabRadius);
				Layers.CurrentImg.pop();
			}
		}
	}

	FinishShape()
	{
		this.SetEditMode(false);
		this.DrawPointList();
		Layers.CurrentImg.loadPixels();
		this.PointList = [];
		this.SelectedPoint = -1;
	}

	SetEditMode(isEditMode)
	{
		this.IsEditMode = isEditMode;

		if (this.IsEditMode)
		{
			select("#IsEditModeOptions").class("optionsBarItem selected");
		}
		else
		{
			select("#IsEditModeOptions").class("optionsBarItem");
		}
	}

	SelectTool()
	{
		super.SelectTool();

		var self = this;

		//IsEditMode toggle
		let editModeButton = createDiv("<img src='assets/Editable Shape/Edit.png''></img>");
		editModeButton.class('optionsBarItem')
		editModeButton.id("IsEditModeOptions")
		editModeButton.parent(select(".ToolOptions"));
		editModeButton.mouseClicked(function()
		{
			self.SetEditMode(!self.IsEditMode);
		});

		//Finish Shape button
		let finishButton = createDiv("<img src='assets/Editable Shape/Finish.png'></img>");
		finishButton.class('optionsBarItem')
		finishButton.id("FinishShapeOptions")
		finishButton.parent(select(".ToolOptions"));
		finishButton.mouseClicked(function()
		{
			self.FinishShape();
		});
	}

	UnselectTool()
	{
		this.FinishShape();
		super.UnselectTool();
	}
}