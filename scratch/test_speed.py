import time
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
import numpy as np

print("Tensorflow version:", tf.__version__)
base = MobileNetV2(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
base.trainable = False

x = tf.keras.layers.GlobalAveragePooling2D()(base.output)
out = tf.keras.layers.Dense(1, activation='sigmoid')(x)
model = tf.keras.Model(inputs=base.input, outputs=out)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Create dummy data of size 100 to measure speed
X_dummy = np.random.rand(100, 224, 224, 3).astype(np.float32)
y_dummy = np.random.randint(0, 2, size=(100, 1)).astype(np.float32)

t0 = time.time()
model.fit(X_dummy, y_dummy, batch_size=16, epochs=1, verbose=1)
t1 = time.time()
print("Time taken for 100 images (1 epoch):", t1 - t0)
