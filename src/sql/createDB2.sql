CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL,
	"email" TEXT NOT NULL UNIQUE,
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
	"message" TEXT,
	"link" TEXT NOT NULL,
	"userId" integer NOT NULL,
	CONSTRAINT "posts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "likes" (
	"id" serial NOT NULL,
	"postId" integer NOT NULL,
	"userLikedId" integer NOT NULL,
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



CREATE TABLE "posthashtag" (
	"id" serial NOT NULL,
	"hashtagId" integer NOT NULL,
	"postId" integer NOT NULL,
	CONSTRAINT "posthashtag_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "followers" (
	"id" serial NOT NULL,
	"followerId" integer NOT NULL,
	"seguidoId" integer NOT NULL,
	CONSTRAINT "followers_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "share" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"postId" serial NOT NULL,
	CONSTRAINT "share_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "Comments" (
	"id" serial NOT NULL,
	"userId" serial NOT NULL,
	"message" TEXT NOT NULL,
	"postId" integer NOT NULL,
	CONSTRAINT "Comments_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "posts" ADD CONSTRAINT "posts_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");

ALTER TABLE "likes" ADD CONSTRAINT "likes_fk0" FOREIGN KEY ("postId") REFERENCES "posts"("id");
ALTER TABLE "likes" ADD CONSTRAINT "likes_fk1" FOREIGN KEY ("userLikedId") REFERENCES "users"("id");


ALTER TABLE "posthashtag" ADD CONSTRAINT "posthashtag_fk0" FOREIGN KEY ("hashtagId") REFERENCES "hashtags"("id");
ALTER TABLE "posthashtag" ADD CONSTRAINT "posthashtag_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("id");

ALTER TABLE "followers" ADD CONSTRAINT "followers_fk0" FOREIGN KEY ("followerId") REFERENCES "users"("id");
ALTER TABLE "followers" ADD CONSTRAINT "followers_fk1" FOREIGN KEY ("seguidoId") REFERENCES "users"("id");

ALTER TABLE "share" ADD CONSTRAINT "share_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "share" ADD CONSTRAINT "share_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("id");

ALTER TABLE "Comments" ADD CONSTRAINT "Comments_fk0" FOREIGN KEY ("userId") REFERENCES "users"("id");
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_fk1" FOREIGN KEY ("postId") REFERENCES "posts"("id");










