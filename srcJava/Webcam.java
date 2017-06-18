import org.opencv.core.Core;
import org.opencv.core.Mat;
//import org.opencv.videoio.VideoCapture;
import org.opencv.highgui.VideoCapture;
import org.opencv.highgui.Highgui;

import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;
import java.awt.Graphics2D;

public class Webcam implements ImageHolder{
	static {
		System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
	}
	     
	private Mat currentImg = new Mat();
	private BufferedImage img;
	private VideoCapture capture;
	
	private BufferedImage stdImg;
	private Graphics2D g2;

	public Webcam(){
		this(0);
	}
	
	public Webcam(int deviceNumber){
		capture = new VideoCapture(deviceNumber);
		if (capture.isOpened()){
			//Capture is open
			
			//Get width and height of capture for bufferedImage
			int width = (int)capture.get(Highgui.CV_CAP_PROP_FRAME_WIDTH);
			int height = (int)capture.get(Highgui.CV_CAP_PROP_FRAME_HEIGHT);
			
			//Initialize BufferedImage, Note: Mats use BGR, not RGB
			if (width + height > 1){
				img = new BufferedImage(width, height, BufferedImage.TYPE_3BYTE_BGR);
				stdImg = new BufferedImage(img.getWidth(), img.getHeight(), BufferedImage.TYPE_4BYTE_ABGR);
				g2 = stdImg.createGraphics();
			}else{
				System.err.println("VideoCapture could not get Frame Size");
			}
		}else{
			System.err.println("VideoCapture is not opened.");
		}
	}
	private void capture(){
		if(capture.isOpened()){
			capture.read(currentImg);
			if (!currentImg.empty()){
				convertMat();
				g2.drawImage(img, 0, 0, null);//Draw the image onto the standard BufferedImage.
				//g2.dispose();
				/*try{
					javax.imageio.ImageIO.write(img, "JPG", new java.io.File("test"+(int)(Math.random()*1000)+".jpg"));
				}catch(Exception ex){
					ex.printStackTrace();
				}*/
			}
		}
	}
	private void convertMat(){
		byte[] inPixels = new byte[currentImg.width() * currentImg.height() * currentImg.channels()];
		byte[] outPixels = ((DataBufferByte) img.getRaster().getDataBuffer()).getData();
		currentImg.get(0, 0, inPixels);		
		System.arraycopy(inPixels, 0, outPixels, 0, inPixels.length);
	}
	
	@Override
	public BufferedImage getCurrentFrame() {//Return a reference to the buffered image
		capture();
		//return img;
		return stdImg;
	}
}
