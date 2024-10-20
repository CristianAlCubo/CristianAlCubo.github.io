from PIL import Image
import os

def resize_images_in_folder(folder_path, output_folder, new_size=(250, 250)):
    # Si el directorio de salida no existe, créalo
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Recorre todos los archivos en la carpeta de entrada
    for filename in os.listdir(folder_path):
        if filename.endswith(".png"):
            input_path = os.path.join(folder_path, filename)
            output_path = os.path.join(output_folder, filename)

            # Abre la imagen
            with Image.open(input_path) as img:
                # Redimensiona la imagen
                img_resized = img.resize(new_size, Image.ANTIALIAS)
                # Guarda la imagen redimensionada en el directorio de salida
                img_resized.save(output_path)

folder_path = "./"
output_folder = "./250"
resize_images_in_folder(folder_path, output_folder)

