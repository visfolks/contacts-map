
install.packages("philentropy")
features <- read.csv(file = '../../data/sample-contacts.csv', header=TRUE)
features[1] <- NULL 
fmat <- data.matrix(features)
library(philentropy)

# distmat = stats::dist(features, method = "euclidean")
distmat <- distance(fmat, method = "jaccard")

# write.csv(distmat, "../../output/distmat.csv", row.names = FALSE)

write.table(round(distmat, digits=2), "../../output/distmat.csv", sep=",", row.names = FALSE, col.names=FALSE)
