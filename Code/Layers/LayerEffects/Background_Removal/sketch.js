var Video;
var PrevImg;
var LastImg;
var DiffImg;
var CurrImg;
var BlobMask;

var NoteGrid;
var OpticalFlow;
var Particles;

const BlobRadius = 3
var BlobKernel;
const FlowStep = 4;
const ScaleFactor = 4;
var ShouldFlipVideo = true;

function setup()
{
	createCanvas(640 * 3, 480 * 2);
	pixelDensity(1);
	Video = createCapture(VIDEO, CapturePrev);
	Video.hide();

	OpticalFlow = new FlowCalculator(FlowStep);


	BlobKernel = GetBlobKernel();
	console.log(BlobKernel);

	background(0);
}

function draw()
{
	CurrImg = createImage(Video.width, Video.height);
	CurrImg.copy(Video, 0, 0, Video.width, Video.height, 0, 0, Video.width, Video.height);

	if (ShouldFlipVideo)
	{
		CurrImg = FlipImage(CurrImg);
	}

	if (typeof CurrImg === 'undefined')
	{
		return;
	}

	// Draw current image at full scale
	background(0);
	image(CurrImg, 0, 0);

	// reduce the resolution of the image to speed up processing
	CurrImg.resize(Video.width / ScaleFactor, Video.height / ScaleFactor);


	// handle prev img being undefined
	// this will only happen for the first frame
	if (typeof PrevImg !== 'undefined')
	{
		let threshold = document.getElementById("thresholdSlider").value;
		let threshold2 = document.getElementById("thresholdSlider2").value;
		let flowThreshold = document.getElementById("flowThresholdSlider").value;
		let blurPre = document.getElementById("blurSliderPre").value;
		let blurPost = document.getElementById("blurSliderPost").value;
		let blobThreshold = document.getElementById("blobThresholdSlider").value;

		DiffImg = CalculateImgDelta(CurrImg, PrevImg, threshold, threshold2);
		DiffImg.filter(BLUR, blurPre);
		BlobMask = MaskBlobDetection(DiffImg, CurrImg, blobThreshold)
		BlobMask.filter(BLUR, blurPost);

		let output = ApplyMask(CurrImg, BlobMask, threshold2)

		// resize diff image to full size to make it easier to debug
		image(DiffImg, 640, 0, Video.width, Video.height);
		image(BlobMask, 640*2, 0, Video.width, Video.height);

		image(PrevImg, 0, 480, Video.width, Video.height);
		image(output, 640, 480, Video.width, Video.height);

		LastImg.loadPixels();
		OpticalFlow.calculate(LastImg.pixels, CurrImg.pixels, CurrImg.width, CurrImg.height);
		DrawFlow(Video.width, flowThreshold);
	}


	LastImg = createImage(CurrImg.width, CurrImg.height);
	LastImg.copy(CurrImg, 0, 0, CurrImg.width, CurrImg.height, 0, 0, CurrImg.width, CurrImg.height);

}

function keyPressed()
{
	if (key == "y")
	{
		CapturePrev();
	}
}

function CapturePrev()
{
	PrevImg = createImage(CurrImg.width, CurrImg.height);
	PrevImg.copy(CurrImg, 0, 0, CurrImg.width, CurrImg.height, 0, 0, CurrImg.width, CurrImg.height);
}

function CalculateImgDelta(currImg, prevImg, threshold, threshold2)
{
	// square the threshold so we can use the DistSquared3d,
	// this means the code can run faster
	let thresholdSquared = threshold * threshold;

	let deltaImg = createImage(currImg.width, currImg.height);
	deltaImg.loadPixels();

	prevImg.loadPixels();
	currImg.loadPixels();
	for (var x = 0; x < currImg.width; x += 1)
	{
		for (var y = 0; y < currImg.height; y += 1)
		{
			var index = (x + (y * currImg.width)) * 4;
			var currR = currImg.pixels[index + 0];
			var currG = currImg.pixels[index + 1];
			var currB = currImg.pixels[index + 2];

			var prevR = prevImg.pixels[index + 0];
			var prevG = prevImg.pixels[index + 1];
			var prevB = prevImg.pixels[index + 2];

			// var d = DistSquared3d(currR, currG, currB, prevR, prevG, prevB);
			let d = ColourDelta(
				color(currR, currG, currB),
				color(prevR, prevG, prevB))

			if (d < thresholdSquared)
			{
				deltaImg.pixels[index + 0] = 0;
				deltaImg.pixels[index + 1] = 0;
				deltaImg.pixels[index + 2] = 0;
				deltaImg.pixels[index + 3] = 255;
			}
			else
			{
				let root = Math.sqrt( d) / 255;

				deltaImg.pixels[index + 0] = root * 255;
				deltaImg.pixels[index + 1] = root * 255;
				deltaImg.pixels[index + 2] = root * 255;
				deltaImg.pixels[index + 3] = 255;
			}
		}
	}
	deltaImg.updatePixels();
	return deltaImg;
}

function ApplyMask(image, mask, threshold2)
{
	let output = createImage(image.width, image.height);
	output.loadPixels();
	image.loadPixels();
	mask.loadPixels();

	for (var x = 0; x < image.width; x += 1)
	{
		for (var y = 0; y < image.height; y += 1)
		{
			var index = (x + (y * image.width)) * 4;

			let maskValue = mask.pixels[index + 0] / 255
			// if (maskValue >= threshold2)
			// {
			// 	maskValue = 1
			// }

			if (maskValue <= 0)
			{
				output.pixels[index + 0] = 0;
				output.pixels[index + 1] = 0;
				output.pixels[index + 2] = 0;
				output.pixels[index + 3] = 255;
			}
			else
			{
				output.pixels[index + 0] = min(maskValue * threshold2, 1) * image.pixels[index + 0];
				output.pixels[index + 1] = min(maskValue * threshold2, 1) * image.pixels[index + 1];
				output.pixels[index + 2] = min(maskValue * threshold2, 1) * image.pixels[index + 2];
				output.pixels[index + 3] = 255;
			}
		}
	}

	output.updatePixels();
	image.updatePixels();
	mask.updatePixels();
	return output;
}





function DrawFlow(xOffset, flowThreshold)
{
	let flowThresholdSquared = flowThreshold * flowThreshold;
	if (OpticalFlow.flow && OpticalFlow.flow.u != 0 && OpticalFlow.flow.v != 0)
	{
		for (var i=0; i<OpticalFlow.flow.zones.length; i++)
		{
			zone = OpticalFlow.flow.zones[i];

			if (DistSquared2d(0,0, zone.u, zone.v) >= flowThresholdSquared)
			{ // only if movement is significant
				stroke(map(zone.u, -FlowStep, +FlowStep, 0, 255),
					   map(zone.v, -FlowStep, +FlowStep, 0, 255), 128);

				let x = zone.x*ScaleFactor + xOffset;
				let y = zone.y*ScaleFactor;
				line(x, y, x + zone.u*ScaleFactor, y + zone.v*ScaleFactor);
			}
		}
	}
}


function MaskBlobDetection(mask, image, colourDeltaThreshold)
{
	let colourDeltaThresholdSquared = colourDeltaThreshold * colourDeltaThreshold
	let output = createImage(image.width, image.height);
	output.loadPixels();
	image.loadPixels();
	mask.loadPixels();

	for (var x = 0; x < image.width; x += 1)
	{
		for (var y = 0; y < image.height; y += 1)
		{
			var index = (x + (y * image.width)) * 4;

			let maskValue = mask.pixels[index + 0]
			let sr = image.pixels[index + 0]
			let sg = image.pixels[index + 1]
			let sb = image.pixels[index + 2]
			if (maskValue <= 0)
			{
				continue
			}


			// kernel
			for (let kX = max(x-BlobRadius, 0); kX <= min(x+BlobRadius, image.width); kX++)
			{
				for (let kY = max(y-BlobRadius, 0); kY <= min(y+BlobRadius, image.height); kY++)
				{
					let i = (kX - x) + BlobRadius
					let j = (kY - y) + BlobRadius
					let kValue = BlobKernel[i][j]
					if (kValue == 0)
					{
						continue;
					}

					var kIndex = (kX + (kY * image.width)) * 4;
					let kr = image.pixels[kIndex + 0]
					let kg = image.pixels[kIndex + 1]
					let kb = image.pixels[kIndex + 2]
					let d = ColourDelta(
						color(image.pixels[index + 0], image.pixels[index + 1], image.pixels[index + 2]),
						color(image.pixels[kIndex + 0], image.pixels[kIndex + 1], image.pixels[kIndex + 2]))
					// var d = DistSquared3d(sr, sg, sb, kr, kg, kb);

					if (d < colourDeltaThresholdSquared)
					{
						// let newValue = output.pixels[kIndex] + maskValue * kValue
						let newValue = max(output.pixels[kIndex], maskValue * kValue)


						output.pixels[kIndex + 0] = newValue
						output.pixels[kIndex + 1] = newValue
						output.pixels[kIndex + 2] = newValue
						output.pixels[kIndex + 3] = 255
					}
				}
			}

			// end of kernal
		}
	}

	output.updatePixels();
	image.updatePixels();
	mask.updatePixels();
	return output;
}

function GetBlobKernel()
{
	if (BlobRadius == 0)
	{
		return [[1]]
	}
	let kernel = [];
	let maxDist = DistSquared2d(0,0,BlobRadius, 0)
	maxDist *= maxDist

	let numValues = (BlobRadius*2+1)*(BlobRadius*2+1)
	let maxValue = 0
	for (let x = -BlobRadius; x <= BlobRadius; x++)
	{
		let row = []
		for (let y = -BlobRadius; y <= BlobRadius; y++)
		{
			let dist = DistSquared2d(0,0,x, y)
			dist *= dist
			let value = 1 - (dist / maxDist)
			row.push(value)
			maxValue = max(maxValue, value);
		}
		kernel.push(row)
	}

	for (let x = 0; x < kernel.length; x++)
	{
		for (let y = 0; y < kernel.length; y++)
		{
			kernel[x][y] = max(0, kernel[x][y] /maxValue)
		}
	}

	return kernel
}




// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function DistSquared2d(x1, y1, x2, y2)
{
	var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1);
	return d / 2;
}

function DistSquared3d(x1, y1, z1, x2, y2, z2)
{
	var d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) + (z2-z1)*(z2-z1);
	return d / 3;
}


function ColourDelta(c1, c2)
{
	// let delta = DistSquared3d(hue(c1), saturation(c1), brightness(c1), hue(c2), saturation(c2), brightness(c2))
	// delta = 0
	let delta = DistSquared3d(c1.levels[0], c1.levels[1], c1.levels[2], c2.levels[0], c2.levels[1], c2.levels[2])
	// return delta
	// delta = Math.abs( hue(c1) - hue(c2))
	// delta = round(delta/10, 1)
	// delta += Math.abs( saturation(c1) - saturation(c2))
	delta += Math.abs( brightness(c1) - brightness(c2)) * Math.abs( brightness(c1) - brightness(c2))
	return delta / 2
}

function FlipImage(img)
{
	let flippedImg = createImage(img.width, img.height);
	flippedImg.loadPixels();

	img.loadPixels();

	for (var x = 0; x < img.width; x += 1)
	{
		for (var y = 0; y < img.height; y += 1)
		{
			var index = (x + (y * img.width)) * 4;
			var flippedIndex = ((img.width-x) + (y * img.width)) * 4;
			flippedImg.pixels[flippedIndex + 0] = img.pixels[index + 0];
			flippedImg.pixels[flippedIndex + 1] = img.pixels[index + 1];
			flippedImg.pixels[flippedIndex + 2] = img.pixels[index + 2];
			flippedImg.pixels[flippedIndex + 3] = img.pixels[index + 3];
		}
	}
	flippedImg.updatePixels();
	return flippedImg;
}


document.getElementById("toggleFlip").onclick = function(){ShouldFlipVideo = !ShouldFlipVideo;};