import * as tf from '@tensorflow/tfjs';


export default class LinearRegressionModel {
    constructor(
        width,
        height,
        maxEpochPerTrainSession = 100000,
        learningRate = 0.001
    ) {
        this.width = width;
        this.height = height;
        this.maxEpochPerTrainSession = maxEpochPerTrainSession;
        this.trainSession = 0;
        this.learningRate = learningRate;
        this.history = [];

        this.initializeModel();
    }

    initializeModel() {
        const prevWeights = this.model && this.model.getWeights();

        this.model = tf.sequential();
        this.model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        this.model.compile({
            optimizer: tf.train.sgd(this.learningRate),
            loss: 'meanAbsoluteError'
        });
        prevWeights && this.model.setWeights(prevWeights);
    }

    xNormalization = xs => xs.map(x => x / this.width);
    yNormalization = ys => ys.map(y => y / this.height);
    yDenormalization = ys => ys.map(y => y * this.height);

    /**
     * Train model until explicitly stop process via invocation of stop method
     * or loss achieve necessary accuracy, or train achieve max epoch value
     *
     * @param x - array of x coordinates
     * @param y - array of y coordinates
     * @param callback - optional, invoked after each training step
     */
    async train(x, y, callback) {
        this.initializeModel();

        const currentTrainSession = ++this.trainSession;
        const currentModel = this.model;
        this.history = [];

        // convert data into tensors
        const input = tf.tensor2d(this.xNormalization(x), [x.length, 1]);
        const output = tf.tensor2d(this.yNormalization(y), [y.length, 1]);

        currentModel.fit(input, output, {
            epochs: this.maxEpochPerTrainSession,
            callbacks: {
                onBatchBegin: () => {
                    console.log('MODEL', currentTrainSession);
                    if (currentTrainSession < this.trainSession) {
                        console.log('STOPPED')
                        currentModel.stopTraining = true;
                    }
                },
                onEpochEnd: async (epoch, { loss }) => {
                    this.history = [...this.history, {
                        epoch,
                        loss
                    }];
                    callback && callback();
                    await tf.nextFrame();
                }
            }
        })
    }

    stop() {
        this.trainSession++;
    }

    /**
     * Predict value basing on trained model
     *  @param x - array of x coordinates
     *  @return Array({x: integer, y: integer}) - predicted values associated with input
     *
     * */
    async predict(x) {
        const input = tf.tensor2d(this.xNormalization(x), [x.length, 1]);
        const output = this.yDenormalization(
            this.model.predict(input)
                .flatten()
                .arraySync()
        );
        return output.map((y, i) => ({ x: x[i], y }));
    }
}