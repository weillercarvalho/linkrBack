CREATE TABLE "followers" (
	"id" serial NOT NULL,
	"followerId" integer NOT NULL,
	"followedId" integer NOT NULL,
	CONSTRAINT "followers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "share" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"originalPostId" integer NOT NULL,
	"sharedPostId" integer NOT NULL,
	CONSTRAINT "share_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL,
	"password" TEXT NOT NULL,
	"picture" TEXT NOT NULL,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"token" TEXT NOT NULL,
	"createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
	"isValid" BOOLEAN NOT NULL DEFAULT 'true',
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "posts" (
	"id" serial NOT NULL,
	"message" TEXT NOT NULL,
	"link" TEXT NOT NULL,
	"userId" integer NOT NULL,
	"shared" BOOLEAN NOT NULL DEFAULT 'false',
	CONSTRAINT "posts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "comments" (
	"id" serial NOT NULL,
	"userId" integer NOT NULL,
	"message" TEXT NOT NULL,
	"postId" integer NOT NULL,
	CONSTRAINT "comments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "likes" (
	"id" serial NOT NULL,
	"userLikedId" integer NOT NULL,
	"postId" integer NOT NULL,
	CONSTRAINT "likes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "hashtags" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	CONSTRAINT "hashtags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "posthashtags" (
	"id" serial NOT NULL,
	"postId" integer NOT NULL,
	"hashtagId" integer NOT NULL,
	CONSTRAINT "posthashtags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "followers" ADD CONSTRAINT "followers_fk0" FOREIGN KEY ("followerId") REFERENCES "users"("id");
ALTER TABLE "followers" ADD CONSTRAINT "followers_fk1" FOREIGN KEY ("followedId") REFERENCES "users"("id");

ALTER TABLE "share" ADD CONSTRAINT "share_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "share" ADD CONSTRAINT "share_fk1" FOREIGN KEY ("originalPostId") REFERENCES "posts"("id");
ALTER TABLE "share" ADD CONSTRAINT "share_fk2" FOREIGN KEY ("sharedPostId") REFERENCES "posts"("id");


ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "comments" ADD CONSTRAINT "comments_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "comments" ADD CONSTRAINT "comments_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("id");

ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("userLikedId") REFERENCES "users"("id");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("id");


ALTER TABLE "posthashtags" ADD CONSTRAINT "posthashtags_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("id");
ALTER TABLE "posthashtags" ADD CONSTRAINT "posthashtags_fk1" FOREIGN KEY ("hashtagId") REFERENCES "hashtags"("id");









